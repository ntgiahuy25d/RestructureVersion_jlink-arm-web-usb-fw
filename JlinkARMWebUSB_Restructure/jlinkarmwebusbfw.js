var JlinkArmWebUsbFW = {
    /*********************************************************************
  *         Copyright [2023] Renesas Electronics Corporation           *
  *                           www.renesas.com                          *
  **********************************************************************
  
  -------------------------- END-OF-HEADER -----------------------------
  
  File    : jlinkarmwebusbfw.js
  Purpose : Implementation of J-Link Web USB firmware for Renesas RA devices
  Literature:
    [1]  ...
  
  Additional information:
    <Any additional information for module>
  */

    /*****************************************************
    * Class definition
    */
    /*********************************************************************
     *
     *       Defines
     *
     **********************************************************************
    */
    //
    // System registers
    //
    // DHCSR
    ARM_CM_REG_DHCSR: 0xE000EDF0,
    ARM_CM_REG_DHCSR_DBGKEY: 0xA05F0000,
    ARM_CM_REG_DHCSR_C_DEBUGEN_ON: 0x1,
    ARM_CM_REG_DHCSR_C_DEBUGEN_OFF: 0x0,
    ARM_CM_REG_DHCSR_C_HALT_ON: 0x2,
    ARM_CM_REG_DHCSR_C_HALT_OFF: 0x0,
    ARM_CM_REG_DHCSR_C_MASKINTS_ON: 0x8,
    ARM_CM_REG_DHCSR_C_STEPS_ON: 0x4,
    // AIRCR
    ARM_CM_REG_AIRCR: 0xE000ED0C,
    ARM_CM_REG_AIRCR_VECTKEY: 0x05FA0000,
    ARM_CM_REG_AIRCR_SYSRESETREQ_ON: 0x4,
    //DFSR
    ARM_CM_REG_DFSR: 0xE000ED30,
    //DEMCR
    ARM_CM_REG_DEMCR: 0xE000EDFC,

    //FPB
    ARM_CM_REG_FP_CTRL: 0xE0002000,
    ARM_CM_REG_FP_REMAP: 0xE0002004,
    ARM_CM_REG_FP_LSR: 0xE0002FB4,
    ARM_CM_REG_FP_COMP: 0xE0002008,
    ARM_CM_REG_FP_CTRL_ENABLE_ON: 0x1,
    ARM_CM_REG_FP_CTRL_KEY_ON: 0x2,
    /*********************************************************************
     *
     *       Public functions
     *
     **********************************************************************
    */
    // ToHexString:function(num, hasPrefix) {
    //     return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
    // },
    WFW_Connect: async function () {
        if (JlinkCom._IsConnected) {
            JlinkCom.LogOut("USB port already connected");
            return;
        }
        else {
            await JlinkCom.UsbConnect();
        }
    },
    WFW_Disconnect: async function () {
        await JlinkCom.UsbDisConnect();
    },
    WFW_Reset: async function () {
        let readData;
        var dataArr = new Uint32Array(1);
        // Clear history reset flag (DHCSR.RESET_ST == 0)
        JlinkCom.LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
        while (true) {
            dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
            JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 0) {
                JlinkCom.LogOut("First clear RESET_ST");
                break;
            }
        }
        // Reset by writing to SYSRESETREQ
        JlinkCom.LogOut("Reset by writing to SYSRESETREQ");
        dataArr[0] = (this.ARM_CM_REG_AIRCR_VECTKEY | this.ARM_CM_REG_AIRCR_SYSRESETREQ_ON) >>> 0;
        JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
        await JlinkCom.WriteMem32(this.ARM_CM_REG_AIRCR, dataArr);

        // Re-Authentication (Some CM devices require authorize after reseting)

        // Wait for reset is performed (DHCSR.RESET_ST == 1)
        JlinkCom.LogOut("Wait for reset is performed (DHCSR.RESET_ST == 1)");
        while (true) {
            dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 1) {
                JlinkCom.LogOut("RESET_ST = 1");
                break;
            }
        }
        // Clear history reset flag (DHCSR.RESET_ST == 0)
        JlinkCom.LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
        while (true) {
            dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
            JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 0) {
                JlinkCom.LogOut("Clear RESET_ST");
                break;
            }
        }
    },
    WFW_IsHalted: async function() {
        console.log("WFW_IsHalted called");

        ret = 0;
        DHCSRValue = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
        // await this.DHCSRLog(DHCSRValue[0]);
        ret = ((DHCSRValue[0] >> 17)  & 0x1) >>> 0;

        console.log("WFW_IsHalted ended");
        return ret;
    },
    /*****************************************************
   * WFW_Halt(): Halt target device
   */
    WFW_Halt: async function () {
        // var dataArr = new Uint32Array(1);
        // let readData;
        // JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 0)");
        // while (true) {
        //     dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1);
        //     JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        //     readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        //     if (readData == 0) {
        //         JlinkCom.LogOut("First clear C_HALT");
        //         break;
        //     }
        // }
        // JlinkCom.LogOut("Halt by writing to C_DEBUGEN");
        // dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_DEBUGEN_ON) >>> 0;
        // JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
        // await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
        // JlinkCom.LogOut("Halt by writing to C_HALT");
        // dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_HALT_ON) >>> 0;
        // JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
        // await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
        // JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 1)");
        // while (true) {
        //     dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1);
        //     JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        //     readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        //     if (readData == 1) {
        //         JlinkCom.LogOut("Hating is successful");
        //         break;
        //     }
        // }
        console.log("WFW_Halt called");
        
        isHalted = await this.WFW_IsHalted();
        if (isHalted == 1) {
            console.log("Processor already halted - Return with nothing to do");
            return 0;
        } else {
            console.log("Processor is running - Keep processing Halt");
        }

        // Halt processor, still keep DEBUGEN on
        DHCSRValue = new Uint32Array(1);
        DHCSRValue[0] = (this.ARM_CM_REG_DHCSR_DBGKEY | this.ARM_CM_REG_DHCSR_C_DEBUGEN_ON | this.ARM_CM_REG_DHCSR_C_HALT_ON) >>> 0;
        await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, DHCSRValue);

        console.log("For safe, wait 500ms");
        await new Promise(resolve => setTimeout(resolve, 0));
        console.log("Wating process is Done");

        // Verify if processor halted
        isHalted = await this.WFW_IsHalted();
        if (isHalted == 1) {
            console.log("Processor halted.");
        } else {
            console.log("Processor failed to halt.");
        }

        console.log("WFW_Halt ended");
        return 0;
    },
    /*****************************************************
   * WFW_UnHalt(): UnHalt target device
  */
    WFW_UnHalt: async function () {
        // var dataArr = new Uint32Array(1);
        // var readData;
        // JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 1)");
        // while (true) {
        //     dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1);
        //     JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        //     readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        //     if (readData == 1) {
        //         JlinkCom.LogOut("Read DHCSR.C_HALT == 1)");
        //         break;
        //     }
        // }
        // JlinkCom.LogOut("Halt by writing to C_DEBUGEN");
        // dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_DEBUGEN_OFF) >>> 0;
        // JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
        // await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
        // JlinkCom.LogOut("Halt by writing to C_HALT");
        // dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_HALT_OFF) >>> 0;
        // JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
        // await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
        // JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 0)");
        // while (true) {
        //     dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1);
        //     JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        //     readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        //     if (readData == 0) {
        //         JlinkCom.LogOut("unhalting is successful");
        //         break;
        //     }
        // }
        console.log("WFW_UnHalt called");

        isHalted = await this.WFW_IsHalted();
        if (isHalted == 0) {
            console.log("Processor already un-halted - Return with nothing to do");
            return 0;
        }

        // UnHalt processor but still keep DEBUGEN on
        DHCSRValue = new Uint32Array(1);
        DHCSRValue[0] = (this.ARM_CM_REG_DHCSR_DBGKEY | this.ARM_CM_REG_DHCSR_C_DEBUGEN_ON | this.ARM_CM_REG_DHCSR_C_HALT_OFF) >>> 0;
        await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, DHCSRValue);

        console.log("For safe, wait 500ms");
        await new Promise(resolve => setTimeout(resolve, 0));
        console.log("Wating process is Done");

        // Verify if processor halted
        isHalted = await this.WFW_IsHalted();
        if (isHalted == 0) {
            console.log("Processor un-halted.");
        } else {
            console.log("Processor failed to un-halt.");
        }

        console.log("WFW_UnHalt ended");
        return 0;
    },
    /*****************************************************
      * WFW_Breakpoint(): Breakpoint target device
      */
    WFW_Breakpoint: async function () {
        var dataArr = new Uint32Array(1);
        let numCode4_7Val;
        let numCode12_14Val;
        let num_Code;
        let num_Lit;
        let n;
        let m;
        let p;
        JlinkCom.LogOut("beakpoint start");
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_FP_CTRL, 1);
        JlinkCom.LogOut("readData= " + JlinkCom.ToHexString(dataArr[0], true));
        numCode4_7Val = ((dataArr[0] >> 4) & 0xF) >>> 0;
        numCode12_14Val = ((numCode4_7Val >> 12) & 0x7) >>> 0;
        num_Lit = (dataArr[0] >> 8) & 0xF;
        num_Code = (numCode12_14Val << 4) | numCode4_7Val;
        n = num_Code - 1;
        JlinkCom.LogOut("readData n= " + n);
        m = num_Code;
        JlinkCom.LogOut("readData num_Code= " + m);
        p = num_Code + num_Lit - 1;
        JlinkCom.LogOut("readData p= " + p);
        JlinkCom.LogOut("beakpoint is successful");
    }
}
async function ConnectController() {
    try {
        await JlinkArmWebUsbFW.WFW_Connect();
    } catch (error) {
        console.log(error);
    }
};
async function DisConnectController() {
    try {
        await JlinkArmWebUsbFW.WFW_Disconnect();
    } catch (error) {
        console.log(error);
    }
};
async function ResetController() {
    try {
        await JlinkArmWebUsbFW.WFW_Reset();
    } catch (error) {
        console.log(error);
    }
};
async function HaltController() {
    try {
        await JlinkArmWebUsbFW.WFW_Halt();
    } catch (error) {
        console.log(error);
    }
};
async function UnHaltController() {
    try {
        await JlinkArmWebUsbFW.WFW_UnHalt();
    } catch (error) {
        console.log(error);
    }
};
async function BreakpointController() {
    try {
        await JlinkArmWebUsbFW.WFW_Breakpoint();
    } catch (error) {
        console.log(error);
    }
};
function GetVersionFile() {
    console.log("version 1.0");
}
// Module = {
//     $SeggerBulk: SeggerBulk,
//     $JlinkCom: JlinkCom,
//     $JlinkArmWebUsbFW: JlinkArmWebUsbFW,
//     ConnectController: ConnectController,
//     DisConnectController: DisConnectController,
//     ResetController: ResetController,
//     HaltController: HaltController,
//     UnHaltController: UnHaltController,
//     BreakpointController: BreakpointController,
//     GetVersionFile: GetVersionFile
// };
// autoAddDeps(Module, '$SeggerBulk');
// autoAddDeps(Module, '$JlinkCom');
// autoAddDeps(Module, '$JlinkArmWebUsbFW');
// mergeInto(LibraryManager.library, Module);