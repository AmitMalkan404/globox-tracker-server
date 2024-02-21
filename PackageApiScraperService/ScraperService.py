import requests
from bs4 import BeautifulSoup
import sys
import io
import json

# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


URL = "https://www.postnet.com/track-a-package/?tracking=RS0854965856Y&carrier=israel-post"

formats = {
    "table": "hold-tracking",
    "row": "row checkpoint",
    "date": "date",
    "time": "time",
    "info": "info column"
}


def encode_hebrew_string(data):
    return data.encode('utf-8').decode('ISO-8859-8')


def getUrlWithTrackingId(trackingId):
    return "https://www.postnet.com/track-a-package/?tracking=" + trackingId + "&refresh=1&carrier=israel-post"


def getSiteData(id):
    dataTrailer = {}
    page = requests.get(getUrlWithTrackingId(id), headers={
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Safari/537.36'})
    soup = BeautifulSoup(page.content, "html.parser")
    hasTrackingInfo = str(page.content).find("hold-tracking")
    if hasTrackingInfo == -1:
        return json.dumps({"0": "error", "data": "shipment information not found"})
    i = 0
    for row in soup.find("div", {"class": formats["table"]}).find_all("div", {"class": formats["row"]}):
        record = {"date": row.find("p", {"class": formats["date"]}).contents[0].strip(),
                  "time": row.find("p", {"class": formats["time"]}).contents[0].strip(),
                  "info": row.find("div", {"class": formats["info"]}).find("h5").contents[0].strip().replace('"', ''),
                  "location":
                      row.find("div", {"class": formats["info"]}).find("div", {"class": "hold-me"}).find("p").contents[
                          0].strip().replace('"', ''),
                  "carrier": row.find("div", {"class": formats["info"]}).find("h5").find("span").contents[
                      0].strip().replace('"', '')
                  }

        dataTrailer[i] = record
        i += 1
    return json.dumps(dataTrailer)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        tracking_id = sys.argv[1]
        data = getSiteData(tracking_id)
        # Encode output to UTF-8 before printing
        # After obtaining the data, encode it before printing
        print(encode_hebrew_string(str(getSiteData(tracking_id))))
    else:
        print("Please provide a tracking ID as a command line argument.")
