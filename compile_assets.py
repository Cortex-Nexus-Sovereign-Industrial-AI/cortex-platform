import os

def build_cortex_assets():
    # Define system paths
    source_dir = "assets/book_src"
    output_dir = "assets/dist"
    source_file = os.path.join(source_dir, "textbook_v1.md")
    output_file = os.path.join(output_dir, "CINIS_Core_Blueprint.txt")
    
    # Ensure system directories exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"[*] Initialized build target path: {output_dir}")
        
    if not os.path.exists(source_file):
        print(f"[!] Error: Source file missing at {source_file}. Please populate the source text.")
        return

    print("[*] Reading raw manuscript text data...")
    with open(source_file, "r", encoding="utf-8") as f:
        raw_content = f.read()
        
    # Apply systematic transformation blocks if necessary
    compiled_data = f"""====================================================================
CORTEX INTELLIGENCE NEXUS INTEL SOLUTIONS (CINIS)
OFFICIAL REPOSITORY DEPLOYMENT ASSET
====================================================================

{raw_content}

====================================================================
END OF FILE NODE - SECURE ASSET PIPELINE ACTIVE
====================================================================
"""
    
    print("[*] Exporting processed structural file matrix...")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(compiled_data)
        
    print(f"[+] Compilation cycle complete. Master file active at: {output_file}")

if __name__ == "__main__":
    build_cortex_assets()
  
