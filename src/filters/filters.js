export const statusFilter = (status) => {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Approved'
    case 2:
      return 'Rejected'
    default:
      return ''
  }
}

export const sliceFilter = (text) => {
	
  const allWords = text.split(' ')
  let sum = 0
  let subString = []
  let result = ''
  for (let i = 0; i < allWords.length; i++) {
    sum += allWords[i].length
    subString.push(allWords[i])
    if (sum > 50) {
      result = `${subString.join(' ')}...`
      break
    }
  }
  return result.length > 0 ? result : allWords.join(' ')
}

