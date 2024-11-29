// common.h
#pragma once
#ifndef JLINKFW_H_
#define JLINKFW_H_
#include <stdio.h>

void WFW_ConnectFW();
void WFW_ResetFW();
void WFW_HaltFW();
void WFW_UnHaltFW();
void WFW_DisconnectFW();
#endif
