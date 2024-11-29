#include <emscripten.h>
#include <emscripten/bind.h>
#include <iostream>
#include <cstdio>
#include <string>
using namespace std;
#define using namespace emscripten;
extern "C"{
    #include "JLinkFW.h"
    EMSCRIPTEN_KEEPALIVE
    void UseJLinkFW() {
        WFW_ConnectFW();
        WFW_ResetFW();
        WFW_HaltFW();
        WFW_UnHaltFW();
        WFW_DisconnectFW();
    }
}
    int main(){
        UseJLinkFW();
        return 1;
    }

