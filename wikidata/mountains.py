#!/usr/bin/env python3

from urllib.request import urlretrieve, urlopen
from shapely.geometry import Point
from urllib.parse import quote
from shutil import copyfile
from urllib import request
import geopandas as gpd
import os.path
import pandas
import shutil
import gzip
import json
import os

if not os.path.exists("data/"):
    os.makedirs("data/")

if not os.path.isfile("data/qrank.csv.gz"):
    urlretrieve(
        'https://qrank.toolforge.org/download/qrank.csv.gz', 'data/qrank.csv.gz')

if not os.path.isfile("data/qrank.csv"):
    with gzip.open("data/qrank.csv.gz", "rb") as gz:
        with open("data/qrank.csv", "wb") as csv:
            shutil.copyfileobj(gz, csv)

if not os.path.isfile("data/mountains.raw.json"):
    allMountainQuery = """
        SELECT ?poi WHERE {
            ?poi wdt:P31 wd:Q8502 .
        }
    """
    urlretrieve(
        'https://query.wikidata.org/sparql?format=json&query={}'.format(quote(allMountainQuery)), "data/mountains.raw.json")

if not os.path.isfile("data/mountains.json"):
    mountains = []

    with open("data/mountains.raw.json") as mountains_raw_json:
        mountains_wikidata = json.load(mountains_raw_json)

        for poi in mountains_wikidata["results"]["bindings"]:
            mountains.append(poi["poi"]["value"].split("entity/")[1])

    with open("data/mountains.json", "w") as mountains_json:
        json.dump(mountains, mountains_json)

if not os.path.isfile("data/mountains_qrank_top.csv"):
    mountains = pandas.read_json("data/mountains.json")
    qrank = pandas.read_csv("data/qrank.csv")

    mountains_qrank = mountains.merge(
        qrank, left_on=0, right_on="Entity").drop(0, axis=1)
    mountains_qrank_top = mountains_qrank[mountains_qrank["QRank"] > 10000].sort_values(
        "QRank", ascending=False)
    mountains_qrank_top.to_csv("data/mountains_qrank_top.csv", index=False)

if not os.path.isfile("data/mountains_meta_qrank.geojson"):
    mountains_qrank = pandas.read_csv("data/mountains_qrank_top.csv")
    mountains_qrank_half = round(len(mountains_qrank) / 2)

    mountains_qrank_1 = mountains_qrank.iloc[:mountains_qrank_half,:]
    mountains_qrank_2 = mountains_qrank.iloc[mountains_qrank_half+1:,:]

    mountains = []

    for qids in [mountains_qrank_1, mountains_qrank_2]:

        mountainsMetaQuery = """
            SELECT DISTINCT
                ?mountain ?mountainName ?lat ?lon
            WHERE
            {
                VALUES ?mountain { {} }

                ?mountain p:P625 ?location .
                ?location psv:P625 ?coord .

                ?coord wikibase:geoLatitude ?lat .
                ?coord wikibase:geoLongitude ?lon .

                SERVICE wikibase:label {
                    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" .
                    ?mountain rdfs:label ?mountainName
                }

                FILTER LANG(?mountainName)
            }
        """.replace("{}", "wd:{}".format(" wd:".join(qids["Entity"].tolist())))

        req_ = request.Request("https://query.wikidata.org/sparql?format=json", method="POST")
        req = urlopen(req_, data="query={}".format(quote(mountainsMetaQuery)).encode())
        data = json.loads(req.read().decode('utf-8'))

        for mountain in data["results"]["bindings"]:
            mountains.append({
                "id": mountain["mountain"]["value"].split("entity/")[1],
                "name": mountain["mountainName"]["value"],
                "geometry": Point(float(mountain["lon"]["value"]), float(mountain["lat"]["value"]))
            })

    mountains_meta = gpd.GeoDataFrame(mountains)

    mountains_meta_qrank = mountains_qrank.merge(
        mountains_meta, left_on="Entity", right_on="id").drop("Entity", axis=1)

    mountains_meta_qrank.rename({"QRank": "qrank"}, axis=1, inplace=True)
    mountains_meta_qrank.drop_duplicates("id", inplace=True)

    gpd.GeoDataFrame(mountains_meta_qrank).to_file("data/mountains_meta_qrank.json", driver="GeoJSON")

    copyfile("data/mountains_meta_qrank.json", "../src/mountains_meta_qrank.json")