import { random_forest} from "./rfc_frontend";

export function classify(result) {
    if (!result || Object.keys(result).length === 0) {
        console.error('Result object is empty or undefined.');
        return;
    }
    //var legitimateCount = 0;
    var predicted_value = 0;
    //var suspiciousCount = 0;
    //var phishingCount = 0;

    // for (var key in result) {
    //     console.log(key +" "+ result[key]);
    //     if (result[key] == "1") phishingCount++;
    //     else if (result[key] == "0") suspiciousCount++;
    //     else legitimateCount++;
    // }
   // var legitimatePercents = legitimateCount / (phishingCount + suspiciousCount + legitimateCount) * 100;
    //console.log(legitimatePercents);
    if (result.length !== 0) {
        var X = [];
        X[0] = [];
        for (var key in result) {
            X[0].push(parseInt(result[key]));
        }
        console.log(X[0]);

        function fetchLive(callback) {
            fetch('https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/classifier.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem('cache', JSON.stringify({ data: data, cacheTime: Date.now() }));
                    
                    callback(data);
                })
                .catch(error => console.error('Error fetching live data:', error));
        }

        function fetchCLF(callback) {
            var items = JSON.parse(localStorage.getItem('cache'));

            if (items && items.cacheTime) {
                var currentTime = Date.now();
                var expirationTime = 60 * 60 * 1000; // 1 hour (adjust as needed)

                if (currentTime - items.cacheTime < expirationTime) {
                    return callback(items.data);
                }
            }

            fetchLive(callback);
        }

        fetchCLF(function (clf) {
            var rf = random_forest(clf);
            var y = rf.predict(X);
            console.log(y)
            if (y[0][0]) {
                console.log("Phishing detected");
                predicted_value = 1;
            } else {
                console.log("Not phishing");
            }
            //localStorage.setItem({'legitimatePercents': legitimatePercents, 'predicted_value': predicted_value});
        });
    }
    return predicted_value;
}
