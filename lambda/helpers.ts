export function generateGoodbye(rhymingOnly: boolean = false) {
  const regularGoodbyes = [
    'Goodbye!',
    'Bye!',
    'Have a great day!',
    'See ya!',
    'Toodles'
  ]

  const rhymingGoodbyes = [
    'See you later, alligator!',
    'Bye bye, butterfly!',
    'Take care, polar bear!',
    'Gotta scoot, little newt!',
    'Be sweet, parakeet!',
    'Off you go, buffalo!',
    'See you soon, raccoon!',
    'So long, King Kong!',
    'Out the door, dinosaur!',
    'Toodle-oo, kangaroo!',
    'Stay fly, dragonfly!',
    'Catch you later, sweet potater!'
  ]

  const goodbyes = rhymingOnly ? rhymingGoodbyes : [...regularGoodbyes, ...rhymingGoodbyes]
  return goodbyes[Math.floor(Math.random() * goodbyes.length)] || 'Goodbye!'
}