# TODO (Copilot): Create a small manual test to run the scraping service twice.
# - Import run_scraping from services.scraping.scrape_service
# - Print the result of first run and second run
# - Explain in comments what should change (new vs updated)

# Small manual test: run the scraping orchestrator twice and print results.
# Expectations:
#  - First run: all items should be inserted => total_new == total_found, total_updated == 0
#  - Second run: same items should be upserted as existing => total_new == 0, total_updated == total_found
from pprint import pprint
from services.scraping.scrape_service import run_scraping

def main() -> None:
    print("Running first scrape...")
    result1 = run_scraping()
    print("First run result:")
    pprint(result1)

    print("\nRunning second scrape (should update existing records)...")
    result2 = run_scraping()
    print("Second run result:")
    pprint(result2)

if __name__ == "__main__":
    main()