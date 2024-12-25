// Adjust progress for the progress bar based on the mode
export const adjustedExponentialProgress = (linearProgress, useExponential = true) => {
    return useExponential
        ? Math.pow(linearProgress, 0.6) // Exponential adjustment
        : linearProgress; // Linear progress remains unaltered
};
