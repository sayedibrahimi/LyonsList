import NodeCache from "node-cache";

const otpCache: NodeCache = new NodeCache({ stdTTL: 600 }); // Cache for 5 minutes

export default otpCache;
