const tags = []

class Tag {
    constructor(name) {
        this.id = Date.now()
        this.name = name
        this.counter = 0
    }

    getTagWithoutId() {
        return {
            name: this.name,
            counter: this.counter
        }
    }
}

const initialTags = [
    "#love",
    "#instagood",
    "#fashion",
    "#photooftheday",
    "#art",
    "#photography",
    "#instagram",
    "#beautiful",
    "#picoftheday",
    "#nature",
    "#happy",
    "#cute",
    "#travel",
    "#style",
    "#followme",
    "#tbt",
    "#instadaily",
    "#repost",
    "#like4like",
    "#summer",
    "#beauty",
    "#fitness",
    "#food",
    "#selfie",
    "#me",
    "#instalike",
    "#girl",
    "#friends",
    "#fun",
    "#photo",
    "#skiing",
    "#guitar",
    "#polyphia"
]

initialTags.forEach(tag => {
    tags.push(new Tag(tag))
})

module.exports = { Tag, tags }