const logDev = (message: any, ...data: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log(message, ...data);
    }
};


export {logDev};