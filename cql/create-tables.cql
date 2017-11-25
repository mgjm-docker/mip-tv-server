CREATE KEYSPACE mip_tv WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TYPE location (
    lat float,
    long float
);

CREATE TABLE rawdata (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    ts timestamp,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day), ts
    )
);

CREATE TABLE rawdata_by_country (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    ts timestamp,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day, country), ts
    )
);

CREATE TABLE rawdata_by_loc (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    ts timestamp,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day, loc), ts
    )
);

CREATE TABLE locations (
    userid uuid,
    day date,
    loc frozen<location>,
    cnt counter,
    PRIMARY KEY (
        (userid, day), loc
    )
);

CREATE TABLE countries (
    userid uuid,
    country text,
    cnt counter,
    PRIMARY KEY (
        (userid, country)
    )
);

CREATE TABLE uniqueIps (
    userid text,
    day date,
    timeframe timestamp, // tie % 10 minutes
    ip text,
    PRIMARY KEY (
        (userid, day), timeframe, ip
    )
);
