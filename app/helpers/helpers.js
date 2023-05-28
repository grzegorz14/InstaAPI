const usersController = require("../controllers/usersController");
const { posts, Post } = require("../models/post");
const { SimpleUser } = require("../models/simpleUser");
const { User, users } = require("../models/user");
const { Image, images } = require("../models/image");

module.exports = {
    getRequestData: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                let body = "";
    
                req.on("data", (part) => {
                    body += part.toString();
                });
                req.on("end", () => {
                    resolve(JSON.parse(body));
                });
    
            } 
            catch (error) {
                reject(error);
            }
        })
    },
    getCircularReplacer: () => {
        const seen = new WeakSet()
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value)
            }
            return value
        };
    },
    setupInitalData: async () => {
        const zendaya = new User("Zendaya", "", "zendaya@gmail.com", "")
        const marczynski = new User("Tomasz", "Marczyński", "marczynski@yahoo.com", "")
        const sergio = new User("Sergio", "Calvo Miniatures", "calvoMiniatures@gmail.com", "")
        const hbo = new User("HBO", "Poland", "hbo@gmail.com", "")
        const grzegorz = new User("Grzegorz", "Szewczyk", "gszewczyk@gmail.com", "")

        zendaya.id = "initialZendaya"
        marczynski.id = "initialMarczynski"
        sergio.id = "initialSergio"
        hbo.id = "initialHBO"
        grzegorz.id = "initialGrzegorz"

        const zendayaProfileImage = new Image("initialZendaya", "", "uploads\\initialZendaya\\profile_image.jpg", Date.now())
        const marczynskiProfileImage = new Image("initialMarczynski", "", "uploads\\initialMarczynski\\profile_image.jpg", Date.now())
        const sergioProfileImage = new Image("initialSergio", "", "uploads\\initialSergio\\profile_image.jpg", Date.now())
        const hboProfileImage = new Image("initialHBO", "", "uploads\\initialHBO\\profile_image.jpg", Date.now())
        const grzegorzProfileImage = new Image("initialGrzegorz", "", "uploads\\initialGrzegorz\\profile_image.jpg", Date.now())

        users.push(zendaya, marczynski, sergio, hbo, grzegorz)

        await usersController.addProfileImage(zendaya.email, zendayaProfileImage)
        await usersController.addProfileImage(marczynski.email, marczynskiProfileImage)
        await usersController.addProfileImage(sergio.email, sergioProfileImage)
        await usersController.addProfileImage(hbo.email, hboProfileImage)
        await usersController.addProfileImage(grzegorz.email, grzegorzProfileImage)

        await usersController.addPost(
            zendaya.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(zendaya.email)), 
                new Image("initialZendaya", "", "uploads\\initialZendaya\\z1.jpg", Date.now()),
                "session session session",
                "New York",
                ["love", "city"], 
                35022))
        await usersController.addPost(
            zendaya.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(zendaya.email)), 
                new Image("initialZendaya", "", "uploads\\initialZendaya\\z2.jpg", Date.now()),
                "good vibes",
                "USA",
                ["summer"],
                24211))
        await usersController.addPost(
            zendaya.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(zendaya.email)), 
                new Image("initialZendaya", "", "uploads\\initialZendaya\\z3.webp", Date.now()),
                "OMG! Dune part 1 is finally out! Can't wait to see the final effect in the cinema :)))",
                "",
                ["dune", "acting", "herbert"],
                11943))
        await usersController.addPost(
            zendaya.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(zendaya.email)), 
                new Image("initialZendaya", "", "uploads\\initialZendaya\\z5.webp", Date.now()),
                "Meet Jules :)",
                "London",
                ["friends"],
                8447))

        await usersController.addPost(
            marczynski.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(marczynski.email)), 
                new Image("initialMarczynski", "", "uploads\\initialMarczynski\\initial_bike1.jpg", Date.now()),
                "This S-WORKS is extremely stiff! And it looks gorgeous...",
                "",
                ["cycling", "photography"],
                147))
        await usersController.addPost(
            marczynski.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(marczynski.email)), 
                new Image("initialMarczynski", "", "uploads\\initialMarczynski\\initial_bike2.jpg", Date.now()),
                "Pinarello Dogma F in the most beautiful color option",
                "Italy",
                ["cycling"],
                64))
        await usersController.addPost(
            marczynski.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(marczynski.email)), 
                new Image("initialMarczynski", "", "uploads\\initialMarczynski\\initial_bike3.jpg", Date.now()),
                "TIME MACHINE 01:00:00",
                "Kraków",
                ["cycling"],
                23))

        await usersController.addPost(
            sergio.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(sergio.email)), 
                new Image("initialSergio", "", "uploads\\initialSergio\\initial_miniature1.jpg", Date.now()),
                "For sell only for 1000$ :)",
                "Essen, Germany",
                ["painting", "art"],
                637))
        await usersController.addPost(
            sergio.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(sergio.email)), 
                new Image("initialSergio", "", "uploads\\initialSergio\\initial_miniature2.jpg", Date.now()),
                "Any tips what to do better?",
                "Essen, Germany",
                [],
                978))
        await usersController.addPost(
            sergio.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(sergio.email)), 
                new Image("initialSergio", "", "uploads\\initialSergio\\initial_miniature3.jpg", Date.now()),
                "5 hours of hard work",
                "Alicante, Spain",
                ["painting"],
                156))
                
        await usersController.addPost(
            hbo.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(hbo.email)), 
                new Image("initialHBO", "", "uploads\\initialHBO\\initial_dune.jpg", Date.now()),
                "Can't wait? It's worth waiting for...",
                "",
                ["dune"],
                7544))
        await usersController.addPost(
            hbo.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(hbo.email)), 
                new Image("initialHBO", "", "uploads\\initialHBO\\initial_euphoria.jpg", Date.now()),
                "With extraordinary music of Labrinth, check it out on Spotify",
                "",
                ["euphoria"],
                3523))
        await usersController.addPost(
            hbo.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(hbo.email)), 
                new Image("initialHBO", "", "uploads\\initialHBO\\initial_hotd.webp", Date.now()),
                "TOMORROW 17:00",
                "",
                ["hotd"],
                16))

                
        await usersController.addPost(
            grzegorz.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(grzegorz.email)), 
                new Image("initialGrzegorz", "", "uploads\\initialGrzegorz\\gbike.jpg", Date.now()),
                "",
                "",
                [""],
                6))
        await usersController.addPost(
            grzegorz.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(grzegorz.email)), 
                new Image("initialGrzegorz", "", "uploads\\initialGrzegorz\\glondon.jpg", Date.now()),
                "",
                "London",
                ["travel"],
                8))
        await usersController.addPost(
            grzegorz.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(grzegorz.email)), 
                new Image("initialGrzegorz", "", "uploads\\initialGrzegorz\\grunning.jpg", Date.now()),
                "Życiówka! 49:50 na 10km",
                "Kraków",
                ["running"],
                28))
        await usersController.addPost(
            grzegorz.email,
            new Post(
                Date.now(), 
                SimpleUser.fromUser(await usersController.getUserByEmail(grzegorz.email)), 
                new Image("initialGrzegorz", "", "uploads\\initialGrzegorz\\gprofile.jpg", Date.now()),
                "",
                "",
                ["hotd"],
                23))
    }
}


