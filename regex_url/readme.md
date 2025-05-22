
You can use the following regular expression to match URLs **that start specifically with `http://` or `https://`**, and ignore those that do not include a protocol:

```regex
\bhttps?:\/\/[^\s/$.?#].[^\s]*\b
```

### Explanation:

* `\b` — word boundary, to ensure it starts matching at the beginning of a word.
* `https?` — matches either `http` or `https`.
* `:\/\/` — matches the `://` part literally.
* `[^\s/$.?#]` — ensures the domain starts with a character that isn't whitespace or some common punctuation that might appear before a URL.
* `.[^\s]*` — matches the rest of the URL until a whitespace.
* `\b` — ends the match at a word boundary.

### Examples it **will match**:

* `http://example.com`
* `https://sub.domain.org/path/file?query=1`

### Examples it **will ignore**:

* `example.com`
* `www.example.org`

Let me know if you want to support `ftp://` or handle edge cases like punctuation at the end.
