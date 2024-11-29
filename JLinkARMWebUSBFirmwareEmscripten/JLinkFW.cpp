#include <emscripten.h>
#include <iostream>
#include <cstdio>
using namespace std;
extern "C" {
  // EMSCRIPTEN_KEEPALIVE
  void WFW_Connect();
  void WFW_Reset();
  void WFW_Halt();
  void WFW_UnHalt();
  void WFW_Disconnect();

  void WFW_ConnectFW() {
    WFW_Connect();
  }
  void WFW_ResetFW(){
     WFW_Reset();
  }
  void WFW_HaltFW(){
     WFW_Halt();
  }
  void WFW_UnHaltFW(){
     WFW_UnHalt();
  }
  void WFW_DisconnectFW(){
     WFW_Disconnect();
  }
}



