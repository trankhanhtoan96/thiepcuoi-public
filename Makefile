.PHONY: build
build:
	@NEW_VERSION=$$(( $$(cat version) + 1 )); \
	echo $$NEW_VERSION > version; \
	echo "Building with version: $$NEW_VERSION"; \
	sed -i.bak 's|src="images/\([^"?]*\)\(?v=[^"]*\)\{0,1\}"|src="images/\1?v='$$NEW_VERSION'"|g' index.html; \
	sed -i.bak 's|href="style\.css\(?v=[^"]*\)\{0,1\}"|href="style.css?v='$$NEW_VERSION'"|g' index.html; \
	sed -i.bak 's|src="script\.js\(?v=[^"]*\)\{0,1\}"|src="script.js?v='$$NEW_VERSION'"|g' index.html; \
	rm -f index.html.bak; \
	echo "Done. All references now use ?v=$$NEW_VERSION"