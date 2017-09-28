using Autofac;
using LocalDBExtractor.Core.Job;
using Quartz;
using Quartz.Impl;
using System;
using System.Configuration;

namespace MerchantService.Admin.App_Start
{
    public class JobConfig
    {
        public static void InitializeJob(IComponentContext componentContext)
        {
            var scheduler = componentContext.Resolve<IScheduler>();
            scheduler.Start();
            JobDetailImpl jobDetail = new JobDetailImpl("syncJob", null, typeof(SyncJob));
            ITrigger trigger = TriggerBuilder.Create().StartNow().WithSimpleSchedule(x => x.WithIntervalInMinutes(Convert.ToInt32(ConfigurationManager.AppSettings["JobSchedulerInterval"])).RepeatForever()).Build();
            scheduler.ScheduleJob(jobDetail, trigger);
        }
    }
}