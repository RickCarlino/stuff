import { defaultIntstructionSet } from "./instruction_set";
/** A slice of bits representing the VM memory. */
export class VM {
  /** Raw JS memory buffer. Avoid direct modification. */
  public buffer: Uint16Array;

  /** Default size of the memory buffer, in words */
  static DEFAULT_SIZE: number = 256;

  /** First memory address that can be used for applications. */
  public START_ADDRESS = 0;

  /** Last cell of memory. */
  public END_ADDRESS: number;

  /** Instruction Pointer. Points to next memory address to be executed */
  public IP: number;

  /** Pointer to top of parameter stack. */
  public PSP: number;

  /** Pointer to top of return stack. */
  public RSP: number;

  constructor(/** Memory size limit */
    public SIZE: number = VM.DEFAULT_SIZE) {
    if(SIZE < 64) {
      throw new Error("The VM requires atleast 64 words of memory.");
    }
    this.reset();
  }

  /** Run one execution cycle */
  tick() {
    let opCode = this.buffer[this.IP];
    let pneumonic = defaultIntstructionSet.fetchPneumonic(opCode);
    // console.log(`Executing ${pneumonic} (${ opCode }) at address ${ this.IP }`);
    defaultIntstructionSet.exec(opCode, this);
  }

  /** Completely reset the VM, including loaded programs. */
  reset() {
    this.END_ADDRESS = this.SIZE - 1;
    this.PSP = this.END_ADDRESS;
    this.RSP = this.END_ADDRESS - 8; // TODO set "STACK SIZE" constant.
    this.IP = this.START_ADDRESS;
    this.buffer = new Uint16Array(this.SIZE);
    this.buffer.fill(0);
  };

  /** Load a program into memory */
  load(program: number[]) {
    var that = this;
    that.reset();
    program.forEach(function (instruction: number, index: number) {
      that.buffer[index + that.START_ADDRESS] = instruction;
    });
  }
}

