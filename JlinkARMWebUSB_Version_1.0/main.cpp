#include <emscripten.h>
#include <emscripten/bind.h>
#include <iostream>
#include <cstdio>
#include <string>
#include "jlinkfw.h"
using namespace std;
#define using namespace emscripten;
int main(){
    GetVersionFile();
    ConnectController();
    DisConnectController();
    ResetController();
    HaltController();
    UnHaltController();
    BreakpointController();
    return 1;
}

