'use strict'

const { EventSourced } = require('cloudstate');
const entity = new EventSourced(['demand_forecast.proto'], 'com.lightbend.vdf.DemandForecastService', {
    persistenceId: 'df-state',
  });

const State = entity.lookupType('com.lightbend.vdf.State')
const DemandedEvent = entity.lookupType('com.lightbend.vdf.VaccineDemandedEvent');
const SuppliedEvent = entity.lookupType('com.lightbend.vdf.VaccineSuppliedEvent');

entity.setInitial((stateName) => State.create({
    stateName: stateName,
    demand: 0,
    supply: 0
}));

entity.setBehavior((state) => ({
    commandHandlers: {
        AddDemand: entity.addDemand,
        AddSupply: entity.addSupply,
        GetDemandForcast: entity.getDemandForcast,

    },
    eventHandlers: {
        VaccineDemandedEvent: entity.demandHandler,
        VaccineSuppliedEvent: entity.supplyHandler
    },
}));

// Command handlers
entity.addDemand = function(command, state, context) {
    console.log("Received Demand command - "+ JSON.stringify(command))
    const demandedEvent = DemandedEvent.create({
        name: command.name,
        description: command.description,
        quantity: command.quantity,
        forState: state.stateName
    });
    context.emit(demandedEvent);
    return demandedEvent;
}

entity.addSupply = function(command, state, context) {
    console.log("Received Supply command - "+ JSON.stringify(command))
    const suppliedEvent = SuppliedEvent.create({
        name: command.name,
        description: command.description,
        quantity: command.quantity,
        forState: state.stateName
    });
    context.emit(suppliedEvent);
    return suppliedEvent;
}

entity.getDemandForcast = function(command, state, context) {
    return state;
}

// Event Handlers
entity.demandHandler = function(event, state) {
    state.demand += event.quantity;
    return state;
}

entity.supplyHandler = function(event, state) {
    state.supply += event.quantity;
    return state;
}

module.exports = entity;