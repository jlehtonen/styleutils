const alphabet = "abcdefghijklmnopqrstuvwxyz";

class UniqueHashGenerator {
  private index: number;

  constructor() {
    this.index = 0;
  }

  getNextHash() {
    const hash = this.hash(this.index);
    this.index++;
    return hash;
  }

  private hash = (index: number) => {
    const base = alphabet.length;
    let hash = "";
    while (index > 0) {
      hash = alphabet[index % base] + hash;
      index = Math.floor(index / base);
    }
    return hash || alphabet[0];
  };
}

const uniqueHashGenerator = new UniqueHashGenerator();

export const nextHash = () => uniqueHashGenerator.getNextHash();
