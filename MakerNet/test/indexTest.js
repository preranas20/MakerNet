/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//creating test


const assert =require('chai').assert;
const index = require('../routes/index');
var boot = require('../app').boot,
      shutdown = require('../app').shutdown,
      port = require('../app').port,
      superagent = require('superagent'),
      expect = require('expect');



describe('homepage', function(){
      it('should respond to GET',function(done){
          superagent
          .get('http://localhost:6012/images');
          .end(function(res){
            expect(res.body).not.to.be.empty;
            done();
        })
      })
    });
