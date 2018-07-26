# Required for access to js_library, ts_library, js_test, web_bundle, etc.
local_repository(
  name = "bazel_javascript",
  path = "../bazel-javascript",
)

# Required for underlying dependencies such as Node and Yarn.
git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.10.0",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories")

# By default, the Node and Yarn versions you have installed locally will be
# ignored, and Bazel will install a separate version instead. This helps
# achieve consistency across teams.
#
# See https://github.com/bazelbuild/rules_nodejs if you'd like to use your
# local Node and Yarn binaries instead.
node_repositories(package_json = [])
