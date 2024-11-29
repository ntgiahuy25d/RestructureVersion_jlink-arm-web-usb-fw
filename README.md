# renesas_webusb_fw_arm

## JLinkARMWebUSBFirmware
The Renesas J-Link WebUSB Firmware for ARM (Renesas RA device).
Including test.
### seggerbulk.js
WebUSB API implemented to communicate with J-Link via USB Port. Should not change if you're not sure what you're doing.
### jlinkcom.js
Segger J-Link very low level APIs. Including the DAP access APIs. Some APIs must be called in strictly-ordered. Should not change if you're not sure what you're doing.
### jlinkarmwebusbfw.js
Renesas J-Link ARM Firmware using WebUSB. Implement your API here.
Supported APIs: Connect, DisConnect, Reset, Halt, Step. Refer the specification of firmware API in below section.
### jlinkarmwebusbfw_test.js
The js file contains the test sequence for implemented firmware. To test the firmware API, call it in _DoStuff().
If you want to change the call sequence, make sure that you're totally understand what you're changing. In-correct sequence may cause hardware broken.
Remember that: Always firstly call WFW_Connect() before calling any other API.
### Index.html
The HTML file to test the firmware. You don't need to change the content of this file when adding a new FW function.

## JLinkWebUSBExample
Original example to control the J-Link. Provided by Segger.

## Renesas J-Link ARM Firmware WebUSB Specification
T.B.D

## JLinkARMWebUSBFirmwareEmscripten
### SeggerBulk - seggerbulk.js -  in JLinkFW.js
The content of SeggerBulk is exactly like seggerbulk.js

### JlinkCom - jlinkcom.js -  in JLinkFW.js
The content of JlinkCom is exactly like seggerbulk.js

### JlinkArmWebUsbFW - jlinkarmwebusbfw.js -  in JLinkFW.js
The content of JlinkArmWebUsbFW is exactly like seggerbulk.js

### SeggerBulk - seggerbulk.js -  in JLinkFW.js
The content of SeggerBulk is exactly like seggerbulk.js


emcc JLinkFW.cpp UseJLinkFW.cpp --js-library JLinkFW.js -s EXPORTED_FUNCTIONS=['_WFW_Connect,_WFW_Reset,_WFW_Halt,_WFW_UnHalt,_WFW_Disconnect,_main'] -sEXPORTED_RUNTIME_METHODS=cwrap -o output.js