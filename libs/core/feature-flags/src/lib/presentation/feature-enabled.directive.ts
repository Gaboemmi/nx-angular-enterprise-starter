import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { FeatureFlagService } from '../application/feature-flag.service';
import { BooleanFeatureFlag } from '../domain/feature-flag';

/** Renders its host only while the supplied UI flag evaluates to true. */
@Directive({ selector: '[featureEnabled]' })
export class FeatureEnabledDirective {
  readonly featureEnabled = input.required<BooleanFeatureFlag>();

  private readonly flags = inject(FeatureFlagService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.flags.boolean(this.featureEnabled())()) {
        if (this.container.length === 0) {
          this.container.createEmbeddedView(this.template);
        }
      } else {
        this.container.clear();
      }
    });
  }
}
