'use strict';
const { expect, assert } = require('chai');
const healthTrackerEntity = require('../healthtracker');
const testContext = {
  emit: function(data) {
  }
};

describe('heartbeatHandler command handler receiving a command for heartbeat', () => {
  it('should return empty message', () => {
    const command = { 
      az: 'us-east',
      serverName: 'ser-1',
      heartbeatTime: '2021-02-25T09:45:29.952Z' 
    };
    const result = healthTrackerEntity.heartbeatHandler(command, {}, testContext);
    assert.deepEqual(result, {})
  });

  it('should emit method be called', () => {
    var called = false;
    
    const context = {
      emit: function(data) {
        called = true;
      }
    };
    const command = { 
      az: 'us-east',
      serverName: 'ser-1',
      heartbeatTime: '2021-02-25T09:45:29.952Z' 
    };

    const result = healthTrackerEntity.heartbeatHandler(command, {}, context);
    expect(called).to.be.true;
  });

  it('should send event to emit method', () => {
    var called = false;
    let capturedData;
    const context = {
      emit: function(data) {
        called = true;
        capturedData = data
      }
    };
    const command = { 
      az: 'us-east',
      serverName: 'ser-1',
      heartbeatTime: '2021-02-25T09:45:29.952Z' 
    };

    const result = healthTrackerEntity.heartbeatHandler(command, {}, context);
    assert.deepEqual(JSON.stringify(capturedData), '{"serverName":"ser-1","heartbeatTime":"2021-02-25T09:45:29.952Z"}');
  });
});