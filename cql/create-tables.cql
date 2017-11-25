CREATE KEYSPACE mip_tv WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE mip_tv;

CREATE TYPE location (
    lat float,
    long float
);

CREATE TABLE rawdata (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    id timeuuid,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day), id
    )
);

CREATE TABLE rawdata_by_country (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    id timeuuid,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day, country), id
    )
);

CREATE TABLE rawdata_by_loc (
    userid uuid,
    ip text,
    country text,
    loc frozen<location>,
    id timeuuid,
    uri text,
    day date,
    PRIMARY KEY (
        (userid, day, loc), id
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
    day date,
    country text,
    cnt counter,
    PRIMARY KEY (
        (userid, day), country
    )
);

CREATE TABLE uniqueIps (
    userid uuid,
    day date,
    timeframe timestamp, // tie % 10 minutes
    ip text,
    PRIMARY KEY (
        (userid, day), timeframe, ip
    )
);
