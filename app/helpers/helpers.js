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
    }
}