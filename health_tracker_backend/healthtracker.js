'use strict';

const {EventSourced} = require('cloudstate');
const entity = new EventSourced(['healthtracker.proto'], 'com.lightbend.healthtracker.HealthTrackerService', {
    persistenceId: 'availability_zone',
  });

const State = entity.lookupType('com.lightbend.healthtracker.State')

const Heartbeat = entity.lookupType('com.lightbend.healthtracker.Heartbeat');
const ServerList = entity.lookupType('com.lightbend.healthtracker.ServerList');

entity.setInitial((az) => State.create({
    serverList: []
}));

entity.setBehavior((state) => ({
    commandHandlers: {
        ReportHearbeat: entity.heartbeatHandler,
        GetServerStatusListForAz: entity.getServerList
    },
    eventHandlers: {
        ServerList: entity.updateServerHeartbeat
    },
}));

// Command handlers
entity.heartbeatHandler = function(commnad, state, context) {
    console.log("Received heartbeat "+ JSON.stringify(commnad))
    const serverHeartbeat = ServerList.create({
        serverName: commnad.serverName,
        heartbeatTime: commnad.heartbeatTime
    });
    context.emit(serverHeartbeat);
    return {};
}
entity.getServerList = function(commnad, state, context) {
    return state;
}

// event handler
entity.updateServerHeartbeat = function(event, state) {
    const existing = state.serverList.find((server) => server.serverName === event.serverName);
  if (existing) {
    existing.heartbeatTime = event.heartbeatTime;
  } else {
    state.serverList.push(event);
  }
  return state;
}

module.exports = entity;