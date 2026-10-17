# Purpose: Manages the database connection. It sets up your SQLAlchemy engine, configured session maker (SessionLocal),
# and provides the base class for your database models (Base) along with a dependency function (get_db) to inject database
# sessions into your routes.