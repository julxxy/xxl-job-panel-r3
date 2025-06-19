export const base64Utils = {
  defaultRecursiveCount: 15,
  isBase64(str: string): boolean {
    if (str.length % 4 !== 0) return false
    const base64RegexArr = [
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9+/]+={0,2}$/,
    ]
    for (const base64Regex of base64RegexArr) {
      if (!base64Regex.test(str)) return false
    }
    try {
      atob(str)
      return true
    } catch {
      return false
    }
  },
  encode(str: string, recursiveCount = 1, currentCount = 0): string {
    if (currentCount >= recursiveCount) return str
    const utf8Bytes = new TextEncoder().encode(str)
    const base64String = btoa(String.fromCharCode(...utf8Bytes))
    return this.encode(base64String, recursiveCount, currentCount + 1)
  },

  decode(encodedStr: string, recursiveCount = 1, currentCount = 0): string {
    if (currentCount >= recursiveCount) return encodedStr

    if (this.isBase64(encodedStr)) {
      try {
        const decoded = atob(encodedStr)
        const utf8Decoded = this.utf8Decode(decoded)
        return this.decode(utf8Decoded, recursiveCount, currentCount + 1)
      } catch {
        return encodedStr
      }
    } else {
      return encodedStr
    }
  },

  utf8Decode(utf8String: string): string {
    const bytes = new Uint8Array([...utf8String].map(char => char.charCodeAt(0)))
    return new TextDecoder().decode(bytes)
  },
}
