import MovingObject from "./lib/movingObject"

type Pair = [MovingObject, MovingObject]

/**
 * Take a pair of objects and a pair of classes and see if the objects
 * are the classes in any order
 *
 * @TODO make the classes `typeof MovingObject` and heal the MovingObject
 * inheritance issues
 */
export const isAnyCombinationOf = (pair: Pair, ClassA: any, ClassB: any): boolean => {
  const isFirstWay = pair[0] instanceof ClassA && pair[1] instanceof ClassB
  const isSecondWay = pair[1] instanceof ClassA && pair[0] instanceof ClassB
  return isFirstWay || isSecondWay
}

/**
* @description For exhaustiveness checking
*/
export const neverGonnaGiveYouUp = (_: never) => { }

/**
* @description Gives back either 1 or -1, with 50/50 chance of either
*/
export const randomUnit = (): 1 | -1 => {
  if (Math.random() < 0.5) return -1
  else return 1
}

/**
* @description Convenience
*/
export const getWindowHeight = () => {
  return window.innerHeight - 5
}

/**
* @description Convenience
*/
export const getWindowWidth = () => {
  return window.innerWidth - 5
}
