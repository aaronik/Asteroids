export default class CustomArray<T> extends Array<T> {
  sample(): T {
    const randomIndex = Math.floor(Math.random() * this.length)
    return this[randomIndex]
  }

  remove(el: T) {
    for (let i = 0; i < this.length; i++) {
      if (el === this[i]) {
        this.splice(i, 1)
        return this
      }
    }

    return false
  }

}

