name: CINIS Autonomous Content Syndication

on:
  push:
    branches:
      - main
    paths:
      - 'content/gbp_updates/**' # Only runs when you add a new post in this folder

jobs:
  syndicate_to_gbp:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: pip install requests

      - name: Execute GBP Syndication Agent
        env:
          GBP_ACCESS_TOKEN: ${{ secrets.GBP_ACCESS_TOKEN }}
        run: python scripts/gbp_agent.py
