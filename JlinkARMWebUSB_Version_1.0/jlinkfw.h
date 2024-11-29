// common.h
#pragma once
#include <emscripten.h>
#include <iostream>
#include <cstdio>
#ifndef JLINKFW_H_
#define JLINKFW_H_
#include <stdio.h>

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  void GetVersionFile();
  void ConnectController();
  void DisConnectController();
  void ResetController();
  void HaltController();
  void UnHaltController();
  void BreakpointController();
}


#endif
