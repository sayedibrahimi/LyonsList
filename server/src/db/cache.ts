import NodeCache from "node-cache";

const otpCache: NodeCache = new NodeCache({ stdTTL: 600, checkperiod: 60 }); // Cache for 10 minutes

export default otpCache;
