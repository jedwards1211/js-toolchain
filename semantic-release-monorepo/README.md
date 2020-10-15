# Why this is here

`semantic-release-monorepo` determines which commits apply to a given packages by seeing if they touched files in that package.

In the case of this monorepo, since:
* I'm generating the variant packages from `base-toolchain` and not committing them at all
* Enough code is shared between the variants that a change in a file might seem relevant to a given package but actually isn't

I'm instead using only the commit messages to determine which packages are affected.  In accordance with `cz-lerna-changelog`,
the fork in this folder looks for a line in the commit message like

```
affects: @jedwards1211/js-toolchain, @jedwards1211/js-react-toolchain
```

To determine which packages are affected by the commit.  If no such line is found it assumes all packages were affected.