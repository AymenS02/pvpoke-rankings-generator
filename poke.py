import requests
import pprint as pp

url = "https://pokeapi.co/api/v2/pokemon/"
params = {'limit': 100}

pokeList = []
for offset in range(0, 1500, 100):
    params['offset'] = offset  # add new value to dict with `limit`
    response = requests.get(url, params=params)

    if response.status_code != 200: 
        print(response.text)
    else:
        data = response.json()
        #pp.pprint(data)
        for item in data['results']:
            id = item['url'].split('/')[-2]
            pokeList.append([id, item['name']])
            if id == '800':
                pokeList = []

print(pokeList)


