addEventListener("DOMContentLoaded", () => {
    document.customState = {userTz: Intl.DateTimeFormat().resolvedOptions().timeZone}
    setTimeout(updateCurrentTimes, 100)
})

const updateCurrentTimes = () => {
    const date = new Date()
    if (date.getSeconds() == document.customState.lastUpdatedSecond) {
        setTimeout(updateCurrentTimes, 100)
        return
    }
    document.customState.lastUpdatedSecond = date.getSeconds()

    const isoTimeElement = document.querySelector("#current-iso-time")
    const uuidTimeElement = document.querySelector("#current-uuidv7-time")


    let uuidBinaryString = [
        // 48 bit timestamp
        //   - 36 bit seconds since epoc
        //   - 12 bits to further precision (millis)
        Math.floor(Date.now()).toString(2).padStart(48, '0'),
        // Hard coded 4 bit version (7)
        (7).toString(2).padStart(4, '0'),
        // 12 bit rand_a
        Math.floor(Math.random() * 2**12).toString(2).padStart(12, '0'),
        // Hard coded 2 bit variant (10)
        (2).toString(2).padStart(2, '0'),
        // 62 bit rand_b
        // TODO: Generate a random 62 bits for use
        (0).toString(2).padStart(62, '0')
    ].join("")
    const byteArray = []
    for (let i = 0; i < uuidBinaryString.length; i += 8) {
        byteArray.push(uuidBinaryString.slice(i, i+8))
    }
    const hexArray = byteArray.map(x => parseInt(x, 2).toString(16).padStart(2, "0"))
    const hexString = hexArray.join("")
    uuidTimeElement.innerText = hexString.slice(0, 8) + "-" +
        hexString.slice(8, 12) + "-" +
        hexString.slice(12, 16) + "-" +
        hexString.slice(16, 20) + "-" +
        hexString.slice(20, 32)

    const currentIsoTimeString = date.toLocaleString('en-US', {timeZone: document.customState.userTz})
    isoTimeElement.innerText = currentIsoTimeString
    setTimeout(updateCurrentTimes, 100)
}
