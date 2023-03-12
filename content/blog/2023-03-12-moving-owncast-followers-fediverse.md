---
title: Keeping your Fediverse followers when moving Owncast servers
---

So you've got an Owncast server running, and it's [part of the Fediverse](https://owncast.online/docs/social/), so your Mastodon friends can be notified when you start a stream. Neat!

If you want to switch hosting providers, or install from scratch, you'll want to make sure your followers continue to receive notifications. This could be easy, or a bit of a challenge. Either way, here's what to do!

# The easy way - Copy over the database

The simple solution is to just copy over the `data/` folder from your old server, onto the new one. This includes the previous database, and assets like logos, etc.

This will work if you're moving to the same (or a newer) version of Owncast.

# If that doesn't work

In my case, I couldn't migrate over because I was [moving to an older Owncast version](owncast-raspberry-pi-4/), for complicated reasons.

So, I had to manually copy over just the Fediverse/ActivityPub data from the old instance.

To finish this, you'll need the sqlite3 client on both instances. On Debian, this is `sudo apt install sqlite3`.

## Extract ActivityPub tables and configuration values

```bash
# On the old server
cd data
sqlite3 owncast.db ".dump ap_followers ap_outbox ap_accepted_activities datastore" > owncast-activitypub.sql
```

Copy the `owncast-activitypub.sql` file off your old server using whatever means you like, scp, etc.

## Tweak import script

I had to make these changes to the sql file manually:

### Remove table schema creation

By default the `.dump` operation includes `CREATE TABLE` lines. Remove them from the script so you're just left with `INSERT` statements.

### Accomodate data differences

Since I was moving onto an older version of Owncast, the database had a different schema, so you'll have to tweak the `INSERT` statements to reflect the version you're moving to. i.e., we're performing a "backwards migration".

 You can see which database version you're running with:

```bash
# On the new instance
sqlite3 owncast.db "select value from config"
```

Check whether any migrations have happened to the `ap_*` tables; you can view the [Forward migrations](https://github.com/owncast/owncast/blob/develop/core/data/migrations.go) file for details.
In particular, I was moving down to version `3`, and so I had to remove the `request_object` column from the `ap_followers` line:

```sql
-- Convert this:
INSERT INTO ap_followers VALUES('https://carhenge.club/users/mattdsteele','https://carhenge.club/users/mattdsteele/inbox','Matt Steele','mattdsteele@carhenge.club','https://s3-us-east-2.amazonaws.com/carhengeclub/accounts/avatars/000/022/282/original/238f5dcb7409495b.jpeg','https://carhenge.club/79be21a3-3c15-4174-9cc2-116440ccda04','2022-11-22 04:39:12','2022-11-22 04:39:12.733741659+00:00',NULL,X'somelongvalue');

-- Into this:
INSERT INTO ap_followers VALUES('https://carhenge.club/users/mattdsteele','https://carhenge.club/users/mattdsteele/inbox','Matt Steele','mattdsteele@carhenge.club','https://s3-us-east-2.amazonaws.com/carhengeclub/accounts/avatars/000/022/282/original/238f5dcb7409495b.jpeg','https://carhenge.club/79be21a3-3c15-4174-9cc2-116440ccda04','2022-11-22 04:39:12','2022-11-22 04:39:12.733741659+00:00',NULL);
```
Depending on the version you're migrating to/from, you may have to make additional changes, or none at all!

### Extract config table values

Remove all the `INSERT INTO datastore` lines except for the following:

```
federation_enabled
federation_go_live_message
federation_username
```

These need to be the same on the new host, in order for clients to validate identity.

## Import data into new instance

After making these changes, copy the `owncast-activitypub.sql` file onto the new host, place it in the `data` folder, and run:

```bash
# On the new server
cd data
sqlite3 owncast.db ".read owncast-activitypub.sql"
```

With that, you should be able to test creating a new stream, or [compose a new post](https://owncast.online/docs/social/#composing-messages-to-your-followers) in the Admin header, and you're off to the races!