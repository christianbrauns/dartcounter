export function getGameCount(type: string): number {
  switch (type) {
    default:
    case '301':
      return 301;
    case '401':
      return 401;
    case '501':
      return 501;
    case '601':
      return 601;
    case '701':
      return 701;
    case '801':
      return 801;
    case '901':
      return 901;
  }
}
