import { ENABLE_LOGS } from '../../config/constants';

/**
 * Custom logger that only logs if ENABLE_LOGS is true
 * @param {...any} args - Arguments to log
 */
export const logger = {
    log: (...args) => {
        if (ENABLE_LOGS) {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (ENABLE_LOGS) {
            console.error(...args);
        }
    },
    warn: (...args) => {
        if (ENABLE_LOGS) {
            console.warn(...args);
        }
    },
    info: (...args) => {
        if (ENABLE_LOGS) {
            console.info(...args);
        }
    }
};
