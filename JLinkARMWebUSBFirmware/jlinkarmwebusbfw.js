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
    const ARM_CM_REG_DHCSR                            = 0xE000EDF0;
    const ARM_CM_REG_DHCSR_DBGKEY                     = 0xA05F0000;
    const ARM_CM_REG_DHCSR_C_DEBUGEN_ON               = 0x1;
    const ARM_CM_REG_DHCSR_C_DEBUGEN_OFF              = 0x0;
    const ARM_CM_REG_DHCSR_C_HALT_ON                  = 0x2;
    const ARM_CM_REG_DHCSR_C_HALT_OFF                 = 0x0;
    const ARM_CM_REG_DHCSR_C_MASKINTS_ON              = 0x8;
    const ARM_CM_REG_DHCSR_C_STEPS_ON                 = 0x4;
    // AIRCR
    const ARM_CM_REG_AIRCR                            = 0xE000ED0C;
    const ARM_CM_REG_AIRCR_VECTKEY                    = 0x05FA0000;
    const ARM_CM_REG_AIRCR_SYSRESETREQ_ON             = 0x4;
    //DFSR
    const ARM_CM_REG_DFSR                             = 0xE000ED30;
    //DEMCR
    const ARM_CM_REG_DEMCR                            = 0xE000EDFC;

    //FPB
    const ARM_CM_REG_FP_CTRL                          = 0xE0002000;
    const ARM_CM_REG_FP_REMAP                         = 0xE0002004;
    const ARM_CM_REG_FP_LSR                           = 0xE0002FB4;
    const ARM_CM_REG_FP_COMP                          = 0xE0002008;
    const ARM_CM_REG_FP_CTRL_ENABLE_ON                = 0x1;
    const ARM_CM_REG_FP_CTRL_KEY_ON                   = 0x2;
    /*********************************************************************
     *
     *       Public functions
     *
     **********************************************************************
    */

    /*****************************************************
     * WFW_Connect(): Connect to target device
     */
    async function WFW_Connect() {
        if (_IsConnected) {
          LogOut("USB port already connected");
          return;
        }
        else {
            await UsbConnect();
        }
    }

    /*****************************************************
     * WFW_Disconnect(): Disconnect from target device
     */
    async function WFW_Disconnect() {
        await UsbDisConnect();
    }

    /*****************************************************
     * WFW_Reset(): Reset target device
     */
    async function WFW_Reset() {
        let readData;
        var dataArr = new Uint32Array(1);
        // Clear history reset flag (DHCSR.RESET_ST == 0)
        LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR, 1);
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 0) {
                LogOut("First clear RESET_ST");
            break;
            }
        }
        // Reset by writing to SYSRESETREQ
        LogOut("Reset by writing to SYSRESETREQ");
        dataArr[0] = (ARM_CM_REG_AIRCR_VECTKEY | ARM_CM_REG_AIRCR_SYSRESETREQ_ON) >>> 0;
        LogOut("Data to write: " + ToHexString(dataArr[0], true));
        await WriteMem32(ARM_CM_REG_AIRCR, dataArr);

        // Re-Authentication (Some CM devices require authorize after reseting)

        // Wait for reset is performed (DHCSR.RESET_ST == 1)
        LogOut("Wait for reset is performed (DHCSR.RESET_ST == 1)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR, 1);
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 1) {
                LogOut("RESET_ST = 1");
            break;
            }
        }
        // Clear history reset flag (DHCSR.RESET_ST == 0)
        LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR, 1);
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
            if (readData == 0) {
                LogOut("Clear RESET_ST");
            break;
            }
        }
    }

    /*****************************************************
     * WFW_Halt(): Halt target device
     */
    async function WFW_Halt() {
        var dataArr = new Uint32Array(1);
        let readData;
        LogOut("check C_HALT (DHCSR.C_HALT == 0)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR_DBGKEY, 1);
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
            if (readData == 0) {
                LogOut("First clear C_HALT");
            break;
            }
        }
        LogOut("Halt by writing to C_DEBUGEN");
        dataArr[0] = (ARM_CM_REG_DHCSR | ARM_CM_REG_DHCSR_C_DEBUGEN_ON) >>> 0;
        LogOut("Data to write: " + ToHexString(dataArr[0], true));
        await WriteMem32(ARM_CM_REG_DHCSR, dataArr);
        LogOut("Halt by writing to C_HALT");
        dataArr[0] = (ARM_CM_REG_DHCSR | ARM_CM_REG_DHCSR_C_HALT_ON) >>> 0;
        LogOut("Data to write: " + ToHexString(dataArr[0], true));
        await WriteMem32(ARM_CM_REG_DHCSR, dataArr);
        LogOut("check C_HALT (DHCSR.C_HALT == 1)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR_DBGKEY, 1); 
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
            if (readData == 1) {
              LogOut("Hating is successful");
            break;
            }
        }
      }
    /*****************************************************
     * WFW_UnHalt(): UnHalt target device
    */
    async function WFW_UnHalt() {
        var dataArr = new Uint32Array(1);
        var readData;
        LogOut("check C_HALT (DHCSR.C_HALT == 1)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR_DBGKEY, 1); 
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
            if (readData == 1) {
              LogOut("Read DHCSR.C_HALT == 1)");
            break;
            }
        }
        LogOut("Halt by writing to C_DEBUGEN");
        dataArr[0] = (ARM_CM_REG_DHCSR | ARM_CM_REG_DHCSR_C_DEBUGEN_OFF) >>> 0;
        LogOut("Data to write: " + ToHexString(dataArr[0], true));
        await WriteMem32(ARM_CM_REG_DHCSR, dataArr);
        LogOut("Halt by writing to C_HALT");
        dataArr[0] = (ARM_CM_REG_DHCSR | ARM_CM_REG_DHCSR_C_HALT_OFF) >>> 0;
        LogOut("Data to write: " + ToHexString(dataArr[0], true));
        await WriteMem32(ARM_CM_REG_DHCSR, dataArr);
        LogOut("check C_HALT (DHCSR.C_HALT == 0)");
        while (true) {
            dataArr = await ReadMem32(ARM_CM_REG_DHCSR_DBGKEY, 1); 
            LogOut("readData = " + ToHexString(dataArr[0], true));
            readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
            if (readData == 0) {
              LogOut("unhalting is successful");
            break;
            }
        }
      }

    /*****************************************************
     * WFW_Breakpoint(): Breakpoint target device
     */
    async function WFW_Breakpoint(){
        var dataArr = new Uint32Array(1);
        let numCode4_7Val;
        let numCode12_14Val;
        let num_Code;
        let num_Lit;
        let n;
        let m;
        let p;
        dataArr = await ReadMem32(ARM_CM_REG_FP_CTRL, 1); 
        LogOut("readData= " + ToHexString(dataArr[0], true));
        numCode4_7Val = ((dataArr[0] >> 4) & 0xF ) >>> 0;
        numCode12_14Val = ((numCode4_7Val >> 12) & 0x7) >>> 0;
        num_Lit = (dataArr[0] >> 8) & 0xF;
        num_Code =  (numCode12_14Val << 4) | numCode4_7Val;
        n = num_Code - 1;
        LogOut("readData n= " + n);
        m = num_Code;
        LogOut("readData num_Code= " + m);
        p = num_Code + num_Lit - 1;
        LogOut("readData p= " + p);
    }

    /*****************************************************
     * ToHexString(): Converts a decimal number into an hexa string
     */
    function ToHexString(num, hasPrefix) {
        return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
    }
 

    /*****************************************************
     * LogOut(): Log debug message to browser console. Nothing happen when _DEBUG = _DEBUG_DISABLE
     *   sLog: message string to log
     */
    function LogOut(sLog) {
        if (_DEBUG == _DEBUG_SIMP || _DEBUG == _DEBUG_FULL) {
        var PreStr = "";
        if (_DEBUG == _DEBUG_FULL) {
            PreStr = new Date().getTime().toString() + " - " + LogOut.caller.name + ": ";
        }
        PreStr = PreStr + sLog;
        console.log(PreStr);
        }
    }