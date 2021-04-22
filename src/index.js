import "./styles.css"

function PokerHand(hand) {
    this.hand = hand
}
PokerHand.prototype.compareWith = function(hand) {
    return compareHands(this.hand, hand.hand || hand)
}

const order = "23456789TJQKA"
function getHandDetails(hand) {
    const cards = hand.split(" ")
    const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a[0])])).sort()
    const suits = cards.map(a => a[1]).sort()
    const counts = faces.reduce(count, {})
    const duplicates = Object.values(counts).reduce(count, {})
    const flush = suits[0] === suits[4]
    const first = faces[0].charCodeAt(0)
    //Also handle low straight
    const lowStraight = faces.join("") === "AJKLM"
    faces[0] = lowStraight ? "N" : faces[0]
    const straight = lowStraight || faces.every((f, index) => f.charCodeAt(0) - first === index)
    let rank =
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9

    return { rank, value: faces.sort(byCountFirst).join("") }

    function byCountFirst(a, b) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a]
        if (countDiff) return countDiff // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1
    }
    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}

function compareHands(h1, h2) {
    let d1 = getHandDetails(h1)
    let d2 = getHandDetails(h2)
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {
            return "Player 1 wins"
        } else if (d1.value > d2.value) {
            return "Player 2 wins"
        } else {
            return "DRAW"
        }
    }
    return d1.rank < d2.rank ? "Player 1 wins" : "Player 2 wins"
}

function test(h1, h2) {
    document.getElementById("app").innerHTML += `<div> <em>Player 1: </em> ${h1} <em>against Player 2: </em> ${h2} - ${compareHands(h1, h2)}</div>`
}

test("AH 2H 3H 4H 5H", "AS AD AC AH JD")
test("AH 2H 3H 4H 5H", "2C 3C 4C 5C 6C")
test("AH KH QH JH TH", "KC QC JC TC 9C")
test("2H 3H 4H 5H 6H", "KS AS TS QS JS")
test("2H 3H 5H 6H 7H", "2S 3H 4H 5S 6C")
test("2S 3H 4H 5S 6C", "3D 4C 5H 6H 2S")
test("2S AH 4H 5S KC", "AH AC 5H 6H 7S")
test("3S 3H 3C AD AH", "4H 4C 4S 2H 2S")
