package main

import (
	"fmt"

	"github.com/mkideal/cli"
)

const version = "0.0.1"

type arg struct {
	cli.Helper
	Version bool     `cli:"!v" usage:"display version"`
	Config  string   `cli:"config" usage:"configuration file"`
	Bundles []string `cli:"B" usage:"bot bundles"`
}

func main() {
	cli.Run(new(arg), func(ctx *cli.Context) error {
		argv := ctx.Argv().(*arg)
		fmt.Printf("Bundles %+v %+v\n", argv.Bundles, argv.Config)
		return nil
	})
}
