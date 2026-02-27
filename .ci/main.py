"""
@file main.py
@brief Главная точка входа для запуска агрегатора пакетов.
"""

import argparse
import logging
from multiprocessing import cpu_count

# Мы импортируем наш пакет как библиотеку
from listpkgs_aggregator import run_aggregation

def main():
    """
    Парсит аргументы командной строки и запускает агрегацию.
    """
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    parser = argparse.ArgumentParser(
        description="Aggregate package metadata from a GitHub organization."
    )
    parser.add_argument(
        "-j", "--jobs",
        type=int,
        default=cpu_count(),
        help=f"Number of parallel processes to use. Defaults to all available cores ({cpu_count()})."
    )
    args = parser.parse_args()
    
    # Вызываем основную логику из нашей библиотеки
    run_aggregation(args.jobs)

if __name__ == "__main__":
    main()
