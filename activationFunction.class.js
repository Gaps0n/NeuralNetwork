activation = {
                heaviside: function(e) {
                    if (e < 0) return 0;
                    if (e >= 0) return 1;
                },
                sigmoid: function(e) {
                    return 1 / (1 + Math.exp(-1 * e));
                },
                gaussian: function(e) {
                    return Math.exp(-Math.pow(e, 2));
                },
                relu: function(e) {
                    return e >= 0 ? e : 0.01 * e;
                }
}

module.exports = activation