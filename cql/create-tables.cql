CREATE TYPE location (
    lat float,
    long float
);

CREATE TABLE rawdata (
    userid uuid,
    ip text,
    country text,
    loc location,
    ts timestamp,
    uri string,
    day date,
    PRIMARY KEY (
        (userid, day), ts
    )
);

CREATE TABLE rawdata_by_country (
    userid uuid,
    ip text,
    country text,
    loc location,
    ts timestamp,
    uri string,
    day date,
    PRIMARY KEY (
        (userid, day, country), ts
    )
);

CREATE TABLE rawdata_by_location (
    userid uuid,
    ip text,
    country text,
    loc location,
    ts timestamp,
    uri string,
    day date,
    PRIMARY KEY (
        (userid, day, location), ts
    )
);

CREATE TABLE locations (
    userid uuid,
    day date,
    loc location,
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
