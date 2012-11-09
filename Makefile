PYTHON ?= python
NODEUNIT ?= ./node_modules/.bin/nodeunit

test: jslint nodeunit

jslintfix:
	@echo "Fixing JS style:"
	@./fixjsstyle

jslint:
	@echo "JSLint:"
	@./jslint

nodeunit:
	$(NODEUNIT) ./tests

.PHONY: jslint jslintfix
