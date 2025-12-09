import logging

def get_logger(name: str):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    handler = logging.StreamHandler()
    fmt = "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
    handler.setFormatter(logging.Formatter(fmt))

    if not logger.handlers:
        logger.addHandler(handler)

    return logger