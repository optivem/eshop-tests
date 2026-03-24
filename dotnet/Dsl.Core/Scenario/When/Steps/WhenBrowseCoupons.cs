using Dsl.Core.Scenario;
using Dsl.Core.Scenario.When.Steps.Base;
using Dsl.Port.When.Steps;
using Driver.Adapter;
using Driver.Port.Shop.Dtos;
using Dsl.Core.Shop.UseCases;
using Optivem.Testing;
using static Dsl.Core.Gherkin.GherkinDefaults;

namespace Dsl.Core.Scenario.When.Steps;

public class BrowseCoupons : BaseWhen<BrowseCouponsResponse, BrowseCouponsVerification>, IBrowseCoupons
{
    public BrowseCoupons(UseCaseDsl app, ScenarioDsl scenario, Func<Task> ensureGiven) : base(app, scenario, ensureGiven)
    {
    }

    protected override async Task<ExecutionResult<BrowseCouponsResponse, BrowseCouponsVerification>> Execute(UseCaseDsl app)
    {
        var shop = await app.Shop(Channel);
        var result = await shop.BrowseCoupons()
            .Execute();

        return new ExecutionResultBuilder<BrowseCouponsResponse, BrowseCouponsVerification>(result)
            .Build();
    }
}



