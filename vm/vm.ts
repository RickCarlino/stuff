import { instructions } from "./instruction_set";
/** A slice of bits representing the FORTH memory area. */
export class VM {
  /** Raw JS memory buffer. Try not to mess with it. */
  public buffer: Uint16Array;

  /** Default size of the memory buffer, in words */
  static DEFAULT_SIZE: number = 256;

  /** First memory address that can be used for applications. */
  public START_ADDRESS = 0;

  /** Last cell of memory. */
  public END_ADDRESS: number;

  /** The Instruction Pointer.
   *  Points to the next exection token to be executed
   */
  public IP: number;

  /** The Parameter Stack Pointer.
   *  Gives access to the data stack.
   * */
  public PSP: number;

  /** The Return Stack Pointer. */
  public RSP: number;

  constructor(/** Memory size limit */
    public SIZE: number = VM.DEFAULT_SIZE) {
    this.END_ADDRESS = this.SIZE - 1;
    this.reset();
  }

  /** Run a "CPU cycle". */
  tick() {
    let ip = this.IP;
    this.IP++;
    let opCode = this.buffer[ip];
    instructions.exec(opCode, this);
  }

  /** Clear stack/memory, set IP to START_ADDRESS. */
  reset() {
    this.PSP = this.END_ADDRESS;
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
